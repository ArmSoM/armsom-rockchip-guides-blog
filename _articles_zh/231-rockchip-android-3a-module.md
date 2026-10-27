---
title: "Rockchip Android 3A 模块开发指南"
description: "Rockchip Android 3A 模块开发指南 — V1.0.0"
excerpt: "Rockchip Android 3A 模块开发指南"
translation_key: "231-rockchip-android-3a-module"
slug: "231-rockchip-android-3a-module"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, AEC]
---

{% raw %}

# Rockchip Android 3A 模块开发指南

依据 RK-KF-YF-793 V1.0.0中文原稿，完整保留编译、启用、参数和故障处理四章。原稿适用表标注所有芯片、所有内核版本，这是原稿范围说明，不是当前兼容性承诺。只有中文来源，没有英文原图；等宽字符通路图作为可编辑代码保留，同时附中文 PDF 的原始图形区域，外语不伪称已本地化。移除封面法律、受众、修订及重复目录，不删技术参数。未执行命令、录音或硬件测试。

校对说明：跨页代码/表格已接续，UUID 内的 PDF 折行已合并，4.1 标题末字已恢复。原表 attenuate_time 和 DOA 五项说明本来为空，保持空白；supEnergy2 的说明原写“点1”，fRk1/fRk2 原写扩张段且无效，HardThreshold/PrioriRatio 等大小写按原文保留，不猜改算法含义。源码注释、UUID、参数名、日志及原示例中的省略号保留原样。安全：adb root/remount 和 setenforce 0 仅用于获授权的调试设备；后者会关闭 SELinux 强制执行，应在测试后恢复策略。音频 dump 可能包含私人录音，应限制访问并按需清理。

<!-- source:cn p2 unit:0 -->

## 1. 编译

<!-- source:cn p3 unit:1 -->

### 1.1 确认项目 BoardConfig.mk 位置

<!-- source:cn p3 unit:2 -->

BoardConfig.mk 的位置与芯片型号和 lunch 时选择的 product 有关比如芯片名称为 rk3588 , product 为 rk3588_u

<!-- source:cn p3 unit:3 -->

```text
# echo $TARGET_PRODUCT
# rk3588_u
```

<!-- source:cn p3 unit:4 -->

则 BoardConfig.mk 的位置为 device/rockchip/rk3588/rk3588_u/BoardConfig.mk

<!-- source:cn p3 unit:5 -->

### 1.2 添加编译开关

<!-- source:cn p3 unit:6 -->

在项目的 BoardConfig.mk 添加下面的编译开关, 确保 hardware/rockchip/audio/preprocess 被编译

<!-- source:cn p3 unit:7 -->

```text
BOARD_USE_AUDIO_PREPROCESS := true
```

<!-- source:cn p3 unit:8 -->

## 2. 启用

<!-- source:cn p3 unit:9 -->

### 2.1 声明音效

<!-- source:cn p3 unit:10 -->

修改 frameworks/av/media/libeffects/data/audio_effects.xml , 声明如下音效合集

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

### 2.2 启用音效

<!-- source:cn p4 unit:14 -->

音效的详细介绍请参考 Rockchip_Developer_Guide_Microphone_Array_Tuning.pdf启用音效之前, 需要修改以下两处:

<!-- source:cn p4 unit:15 -->

1) 修改 tinyalsa_hal 录音时的帧长为 16ms, 向下取整

<!-- source:cn p4 unit:16 -->

```text
period_size = (int)(rate * 0.016 / 4) * 4
```

<!-- source:cn p4 unit:17 -->

比如采样率 48000, period_size = (int)(48000 * 0.016 / 4) * 4 = 768比如采样率 44100, period_size = (int)(44100 * 0.016 / 4) * 4 = 704确认后修改对应的 pcm confighardware/rockchip/audio/tinyalsa_hal/audio_hw.c

<!-- source:cn p4 unit:18 -->

```text
static struct pcm_config pcm_config_in = {
    // ...
    .rate = 48000,
    .period_size = 768,
};
```

<!-- source:cn p4 unit:19 -->

2) 修改 MIC 通道数

<!-- source:cn p5 unit:20 -->

确认 MIC 通道数后修改下面的配置, 比如 2 channel MIChardware/rockchip/audio/tinyalsa_hal/audio_hw.c

<!-- source:cn p5 unit:21 -->

```text
#define PCM_CAPTURE_CHANNELS 2
```

<!-- source:cn p5 unit:22 -->

单 MIC 目前是以 2 channel 来处理

<!-- source:cn p5 unit:23 -->

#### 2.2.1 AEC

<!-- source:cn p5 unit:24 -->

| <code>effect</code> | 说明 |
| --- | --- |
| <code>preproc_aec_normal</code> | AEC 模块 |
| <code>preproc_aec_delay</code> | AEC 延时估计子模块 |
| <code>preproc_aec_array_reset</code> | AEC 输入音频通道顺序重排功能 |
| <code>preproc_ref_hw</code> | 硬回采 |
| <code>preproc_ref_sw_dlp</code> | 软回采 DLP 方式 |
| <code>preproc_ref_sw_alp_playback</code> | 软回采 Aloop 数据缓存 |
| <code>preproc_ref_sw_alp_capture</code> | 软回采 Aloop 数据获取 |

<!-- source:cn p5 unit:25 -->

AEC 需要回采信号 (参考信号) 来消除回声, 因此需要根据音频通路或拓扑来配置

<!-- source:cn p5 unit:26 -->

1) 硬回采如下图示: [L1][R1]... 表示回采数据, 在 SPK 的前级回环到某个音频接口 (CPU DAI1); [L2][R2]... 表示 MIC数据

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

修改回采通道数, 比如 2 channel 回采hardware/rockchip/audio/tinyalsa_hal/audio_hw.c

<!-- source:cn p6 unit:31 -->

```text
#define PCM_REFERENCE_CHANNELS 2
```

<!-- source:cn p6 unit:32 -->

修改 frameworks/av/media/libeffects/data/audio_effects.xml , 绑定对应的流到下面的音效

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

2) 软回采 DLP 方式适用于播放和录音用同一个 cpu dai如下图示: [L1][R1]... 表示回采数据, 缓存到 DLP; [L2][R2]... 表示 MIC 数据

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

修改 kernel 配置, 编译 DLP

<!-- source:cn p6 unit:37 -->

```text
CONFIG_SND_SOC_ROCKCHIP_DLP_PCM
```

<!-- source:cn p6 unit:38 -->

修改 dts 配置, 在对应的 cpu dai 上使能 DLP

<!-- source:cn p7 unit:39 -->

```text
&i2s {
        rockchip,digital-loopback;
};
```

<!-- source:cn p7 unit:40 -->

cpu dai 可以是: i2s0_8ch, i2s1_8ch, i2s2_2ch, i2s3_2ch, sai0, sai1 等等修改通路配置, 在 tinyalsa_hal 增加对应的通路配置不同的声卡名对应不同通路配置文件, 通过 sound_card_config_list 确认, 没有匹配则使用默认的default_config.h比如 2 channel mic + 2 channel 回采

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

总共有以下几个选项, 根据对应的 MIC 通道数和回采通道数配置即可

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

修改回采通道数, 比如 2 channel 回采hardware/rockchip/audio/tinyalsa_hal/audio_hw.c

<!-- source:cn p8 unit:45 -->

```text
#define PCM_REFERENCE_CHANNELS 2
```

<!-- source:cn p8 unit:46 -->

修改 frameworks/av/media/libeffects/data/audio_effects.xml , 绑定对应的流到下面的音效

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

3) 软回采 Aloop 方式适用于播放和录音不在同一个 cpu dai如下图示: [L1][R1]... 表示回采数据, 缓存到 Aloop; [L2][R2]... 表示 MIC 数据MIC 数据和回采数据最终在 Step#4 中拼接

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

修改 kernel 配置, 编译 Aloop

<!-- source:cn p9 unit:51 -->

```text
CONFIG_SND_DRIVERS
CONFIG_SND_ALOOP
```

<!-- source:cn p9 unit:52 -->

修改回采通道数不需配置回采通道数 (因为 Aloop 方式默认 2 channel)hardware/rockchip/audio/tinyalsa_hal/audio_hw.c

<!-- source:cn p9 unit:53 -->

```text
#define PCM_REFERENCE_CHANNELS 0
```

<!-- source:cn p9 unit:54 -->

修改 frameworks/av/media/libeffects/data/audio_effects.xml , 绑定对应的流到下面的音效

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

| <code>effect</code> | 说明 |
| --- | --- |
| <code>preproc_bf_fast_aec</code> | BF 线性残留回声消除模块, 该功能用于唤醒通路进一步消除回声 |
| <code>preproc_bf_wakeup</code> | BF 唤醒模块 |
| <code>preproc_bf_dereverb</code> | BF 去混响模块 |
| <code>preproc_bf_nlp</code> | BF 非线性残留回声消除模块, 该功能用于通话通路进一步消除回声<br>(该模块已弃用) |
| <code>preproc_bf_aes</code> | BF 非线性残留回声消除模块 |
| <code>preproc_bf_agc</code> | BF 自动增益控制模块 |
| <code>preproc_bf_anr</code> | BF 噪声抑制模块 |
| <code>preproc_bf_gsc</code> | BF 波束后滤波模块, 用于进一步消除噪声, 视实际效果决定是否打开 |
| <code>preproc_bf_gsc_method</code> | BF 关闭则GSC采用LMS方法, 打开GSC采用RLS方法, RLS算力高于<br>LMS算法 |
| <code>preproc_bf_fix</code> | BF 启用固定方向波束 |
| <code>preproc_bf_dtd</code> | BF 单双讲检测模块 |
| <code>preproc_bf_cng</code> | BF 舒适度噪声模块 |
| <code>preproc_bf_eq</code> | BF EQ调节模块 |
| <code>preproc_bf_chn_select</code> | BF 用于定制化扩展 MIC 需求场景 |
| <code>preproc_bf_howling</code> | BF 去啸叫模块, 视实际场景需求决定是否打开 |
| <code>preproc_bf_doa</code> | BF 声源定位模块, 用于估计声源方向, 视实际场景需求决定是否打开 |
| <code>preproc_bf_wind</code> | BF 去⻛噪模块, 视实际场景需求决定是否打开 |
| <code>preproc_bf_ainr</code> | BF AI降噪模块, 若开启该模块则ANR模块将强制关闭 |

<!-- source:cn p10 unit:58 -->

如果需要开 preproc_bf_fast_aec 和 preproc_bf_aes, 需要先配置 AEC 相关修改 frameworks/av/media/libeffects/data/audio_effects.xml , 绑定对应的流到下面的音效

<!-- source:cn p10 unit:59 -->

1) BF 用于唤醒推荐音效如下

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

2) BF 用于语音通话推荐音效如下

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

3) 根据需要绑定其他的音效

<!-- source:cn p11 unit:65 -->

#### 2.2.3 RX

<!-- source:cn p11 unit:66 -->

| <code>effect</code> | 说明 |
| --- | --- |
| <code>preproc_rx_anr</code> | 噪声抑制模块, 视实际场景需求决定是否打开 |
| <code>preproc_rx_howling</code> | 去啸叫模块, 视实际场景需求决定是否打开 |

<!-- source:cn p11 unit:67 -->

修改 frameworks/av/media/libeffects/data/audio_effects.xml , 绑定对应的流到下面需要的音效

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

### 2.3 验证

<!-- source:cn p12 unit:70 -->

1) 确认是否已经注册到 AudioFlinger通过 dumpsys media.audio_flinger 确认

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

2) 确认是否能正常绑定到对应的 stream录音或语音, 通过 dumpsys media.audio_flinger 确认以语音, 软回采 Aloop 为例

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

## 3. 参数

<!-- source:cn p16 unit:79 -->

默认配置保存在 rkaudio_effect_preprocess.xmlSDK 默认保存到 hardware/rockchip/audio/preprocess/出厂默认 install 到设备的 /vendor/etc/

<!-- source:cn p16 unit:80 -->

### 3.1 参数说明

<!-- source:cn p16 unit:81 -->

参考文档 Rockchip_Developer_Guide_Microphone_Array_Tuning.pdf集成后参数默认保存到 rkaudio_effect_preprocess.xml, 以下说明均围绕文档和此 xml 来讨论

<!-- source:cn p16 unit:82 -->

### 3.2 参数设置

<!-- source:cn p16 unit:83 -->

#### 3.2.1 AEC 模块参数

<!-- source:cn p16 unit:84 -->

| 属性 | 说明 |
| --- | --- |
| <code>pos</code> | 回采通道所在位置, 0 为回采通道位于mic数据最前面,1 则在最后面 |
| <code>drop_ref_channel</code> | 不处理的回采通道数 |
| <code>delay_len</code> | 延迟估计不开时为默认硬回采延迟点, 延迟估计打开时为起始延迟估计点 |
| <code>look_ahead</code> | 缓存⻨克⻛端数据⻓度, 除非已知采集⻨克⻛信号晚于回采信号可配置, 其余<br>情况默认置0 |
| <code>filter_len</code> | 配置线性AEC滤波器⻓度, 设置越⻓对于回声估计越准确, 但收敛速度相应越<br>慢且算力越大. 一般可配置为2/4/6/8 |
| <code>Array_list</code> | 配置音频通道顺序, 生效需要启用 preproc_aec_array_reset |

<!-- source:cn p16 unit:85 -->

延时估计子模块参数设置 (生效需要启用 preproc_aec_delay)

<!-- source:cn p17 unit:86 -->

| 属性 | 说明 |
| --- | --- |
| <code>max_frame</code> | 延时估计最⻓估计帧数, 一般场景建议设为16 |
| <code>least_delay</code> | 延时估计最短估计帧数, MaxFrame没有特别大时建议设为0 |
| <code>jump_frame</code> | 初始跳过帧数, 一般设为12 |
| <code>delay_offset</code> | offset帧数, 用于防止延时估计过大导致⻨克⻛信号晚于回采信号, 一般设为1 |
| <code>mic_amp_thr</code> | mic端最小能量阈值, 低于该值不更新延时估计结果, 一般设为50 |
| <code>ref_amp_thr</code> | ref端最小能量阈值, 低于该值不更新延时估计结果, 一般设为50 |
| <code>start_freq</code> | 延时估计起始频段的频率, 一般选择语音集中频段, 根据实际收音效果调整, 一般<br>设为500 |
| <code>end_freq</code> | 延时估计终止频段的频率, 一般选择语音集中频段, 根据实际收音效果调整, 一般<br>设为4000 |
| <code>smooth_factor</code> | 平滑系数, 一般取值为[0.95,1), 越高延时估计结果越稳定, 越低延时估计结果更<br>新越快, 一般设为0.97/0.99 |

<!-- source:cn p17 unit:87 -->

#### 3.2.2 BF 模块参数

<!-- source:cn p17 unit:88 -->

| 属性 | 说明 |
| --- | --- |
| <code>ref_pos</code> | 回采通道所在位置, 0 为回采通道位于mic数据最前面,1 则在最后面 |
| <code>targ</code> | 当 preproc_bf_fix 开启时, 设置拾音方向 |
| <code>drop_ref_channel</code> | 不处理的回采通道数 |

<!-- source:cn p17 unit:89 -->

1) AES 模块参数设置 (生效需要启用 preproc_bf_aes)

<!-- source:cn p18 unit:90 -->

| 属性 | 说明 |
| --- | --- |
| <code>beta_up</code> | 上升速度, 该值越大则非线性抑制越强, 建议0.001-0.01之间 |
| <code>beta_down</code> | 下降速度, 该值越大则非线性抑制越弱, 建议0.001-0.01之间 |
| <code>beta_up_low</code> | 低频段上升速度, 特性以及取值同 beta_up |
| <code>beta_down_low</code> | 低频段下降速度, 特性以及取值同 beta_down |
| <code>low_freq</code> | 低频分段 |
| <code>high_freq</code> | 高频分段 |
| <code>thd_flag</code> | 置 1 开启谐波失真抑制, 置 0 则关闭 |
| <code>hard_flag</code> | 置 1 开启 Hard 模式, 对于回声消除抑制更强, 但也有可能造成语音过消 |
| <code>limit_ratio_0</code> | 表示各频段残留回声的比例最小值, 一般建议取值范围[1.0f, 5.0f], 设置越大,<br>回声消除效果越强. 3列分别对应低频分段、中频分段、高频分段(由上面<br>的 low_freq 以及 high_freq 设置 |
| <code>limit_ratio_1</code> | 表示各频段消除残留回声的比例, 一般建议取值范围[1.0f, 3.0f], 设置越大,<br>回声消除效果越强. 3列分别对应低频分段、中频分段、高频分段(由上面<br>的 low_freq 以及 high_freq 设置 |
| <code>thd_split_freq_0</code> | 谐波抑制频段, 不需要时该行可以全置 0. 每一行表示一个频段, 第一列表示<br>频段起始点, 第二列表示频段终止点. 取值范围均为[0,1/2 * sample rate] |
| <code>thd_split_freq_1</code> | 同上 |
| <code>thd_split_freq_2</code> | 同上 |
| <code>thd_split_freq_3</code> | 同上 |
| <code>thd_sup_degree_0</code> | 谐波抑制程度, 对应上表的频段, 配置的对应消除比例, 当上面有全 0 行时,<br>该表对应行的设置也将无效. 从第一列到最后一列分别表示频段内有可能成<br>为二次到十一次谐波时消除相应基频的比例, 一般建议取值范 [0.001f,1.0f],<br>设置越大, 消除效果越强 |
| <code>thd_sup_degree_1</code> | 同上 |
| <code>thd_sup_degree_2</code> | 同上 |
| <code>thd_sup_degree_3</code> | 同上 |
| <code>hard_split_freq_0</code> | 配置为Hard模式的频段以及计算平均增益的频段, 第一列表示起始, 第二列<br>表示终止, 取值范围均为 [0,1/2*sample rate], 配置为Hard模式的频段最多<br>设置4个, 最后一行为计算平均增益的频段, 该频段将在下一个参数<br>HardThreshold中进行使用 |
| <code>hard_split_freq_1</code> | 同上 |
| <code>hard_split_freq_2</code> | 同上 |
| <code>hard_split_freq_3</code> | 同上 |
| <code>hard_split_freq_4</code> | 同上 |
| <code>hard_threshold</code> | Hard模式开启阈值, 4个阈值分别对应上个参数配置的4个频段. 使用平均增<br>益频段和该参数配置的阈值进行对比, 当平均增益低于阈值时, 对应的频段<br>会开启Hard模式 |

<!-- source:cn p19 unit:93 -->

2) AGC 模块参数设置 (生效需要启用 preproc_bf_agc)

<!-- source:cn p19 unit:94 -->

| 属性 | 说明 |
| --- | --- |
| <code>attack_time</code> | 建议范围:20~600ms. 触发时间, 即AGC增益上升所需要的时间 |
| <code>release_time</code> | 建议范围:20~600ms. 施放时间, 即AGC增益下降所需要的时间 |
| <code>attenuate_time</code> |  |
| <code>max_gain</code> | 建议范围:0~50dB. 最大增益, 同时也是线性段增益 |
| <code>max_peak</code> | 取值范围:0~-87dB. 经AGC处理后, 输出语音的最大能量 |
| <code>fRth0</code> | 取值范围:0~-87dB. 噪声⻔阈值, 低于该值的语音不被增益 |
| <code>fRth1</code> | 取值范围:0~-87dB. 扩张段结束能量dB阈值, 高于该值的语音以max_gain增<br>益 |
| <code>fRth2</code> | 取值范围:0~-87dB. 压缩段起始能量dB阈值, 高于该值的语音增益逐渐下降至<br>0dB |
| <code>fRk0</code> | 扩张段斜率 |
| <code>fRk1</code> | 扩张段斜率 (无效参数) |
| <code>fRk2</code> | 扩张段斜率 (无效参数) |
| <code>fLineGainDb</code> | 线性段提升dB数 (无效参数) |
| <code>swSmL0</code> | 扩张段时域平滑点数 (无效参数) |
| <code>swSmL1</code> | 线性段时域平滑点数 (无效参数) |
| <code>swSmL2</code> | 压缩段时域平滑点数 (无效参数) |

<!-- source:cn p19 unit:95 -->

3) ANR 模块参数设置 (生效需要启用 preproc_bf_anr)

<!-- source:cn p20 unit:96 -->

| 属性 | 说明 |
| --- | --- |
| <code>noiseFactor</code> | 噪声估计水平, 一般取值范围在[0.5f,1.5f], 越大噪声消除越干净 |
| <code>swU</code> | 噪声估计帧⻓时间片, 一般取值范围[2,20], 设置越大对平稳噪声估计越准确,<br>对突变噪声收敛越慢;反之对突变噪声收敛越快但容易造成语音过消 |
| <code>psiMin</code> | 语音存在概率判断阈值, 取值范围[0.0f,1.0f], , 设置越大, 噪音消除效果越强 |
| <code>psiMax</code> | 语音存在概率判断阈值, 取值范围[0.0f,1.0f], 设置越大, 噪音消除效果越强 |
| <code>fGmin</code> | 噪声消除最小值, 取值范围[0.0f,1.0f], 设置越小, 噪音消除效果越强 |
| <code>supFreq1</code> | 恒频噪声抑制点1, 取值范围[0,1/2*sample rate], 始终抑制设置点噪声 |
| <code>supFreq2</code> | 恒频噪声抑制点2, 取值范围[0,1/2*sample rate], 始终抑制设置点噪声 |
| <code>supEnergy1</code> | 恒频噪声抑制点1对应的能量阈值, 一般取值100000, 当频点能量超出该值时<br>会对恒频噪声的估计进行更新 |
| <code>supEnergy2</code> | 恒频噪声抑制点1对应的能量阈值, 一般取值100000, 当频点能量超出该值时<br>会对恒频噪声的估计进行更新 |
| <code>interV</code> | 取帧间隔, 一般取值范围[2,20], 设置越大估计的噪声越平稳, 类似swU功能 |
| <code>biasMin</code> | 噪声补偿, 一般取值范围[1.0f, 2.0f], 设置越大噪声消除效果越强 |
| <code>updateFrm</code> | 快速收敛⻓度, 一般设置为15, 在开头15帧快速收敛 |
| <code>nPreGammaThr</code> | 纯噪声概率估计阈值, 一般取值范围 (3.0f,5.0f), 设置越大噪声消除效果越强 |
| <code>nPreZetaThr</code> | 纯噪声概率估计阈值, 一般取值范围 (1.0f,3.0f), 设置越大噪声消除效果越强 |
| <code>sabsGammaThr0</code> | 语音不存在概率估计阈值, 一般取值范围 (0.5f,1.5f), 设置越大噪声消除效果<br>越强 |
| <code>sabsGammaThr1</code> | 语音不存在概率估计阈值, 一般取值范围 (2.f,4.0f), 设置越大噪声消除效果越<br>强 |
| <code>infSmooth</code> | 输入信号平滑系数, 取值范围(0.0f,1.0f) |
| <code>probSmooth</code> | 语音存在概率平滑系数, 取值范围(0.0f,1.0f) |
| <code>compCoeff</code> | 噪声补偿, 一般取值范围[1.0f, 2.0f], 对于低于平均噪声估计的频段进行补偿,<br>设置越大噪声消除效果越强 |
| <code>prioriMin</code> | 先验信噪比最小值, 取值范围(0.0f, 0.5f), 设置越大噪声消除效果越弱 |
| <code>postMax</code> | 后验信噪比最大值, 一般设为40 |
| <code>prioriRatio</code> | 先验信噪比平滑系数, 取值范围(0.0f,1.0f), 设置越大噪声消除效果越强 |
| <code>prioriRatioLow</code> | 先验信噪比平滑系数, 取值范围(0.0f,1.0f), 设置越大噪声消除效果越强 |
| <code>splitBand</code> | 分频段index, 取值范围[0,32], 对于低于该index的先验信噪比用<br>PrioriRatioLow进行平滑, 反之用PrioriRatio |
| <code>prioriSmooth</code> | 先验信噪比平滑系数, 取值范围(0.0f,1.0f), 设置越大噪声消除效果越强 |
| <code>tranMode</code> | 冲击噪声开关, 置0表示关闭, 置1表示使用检测消除方法, 置2表示使用估计消<br>除方法 |

<!-- source:cn p21 unit:99 -->

4) 去混响模块参数设置 (生效需要启用 preproc_bf_dereverb)

<!-- source:cn p21 unit:100 -->

| 属性 | 说明 |
| --- | --- |
| <code>rlsLg</code> | RLS滤波器阶数, 用于唤醒模块去混响, 一定范围内, 阶数越大, 去混响效果越强, 算力<br>消耗越大, 建议取值:4 |
| <code>curveLg</code> | 分布曲线阶数, 用于通话模块去混响, 阶数越大, 去混响效果越强, 越容易过消,建议取<br>值:10 |
| <code>delay</code> | RLS滤波器延时, 决定早期混响保留程度, 建议取值:2 |
| <code>forgetting</code> | RLS滤波器遗忘因子, 因子越小, rls去混响能力越强, 越容易过消, 建议范围:0.98-<br>0.999 |
| <code>t60</code> | 混响时间估计值(单位:s), 越大, 去混响能力越强, 但是越容易过消除, 低混响场景<br>建议取值0.68, 中高混响场景建议取值1.5 |
| <code>coCoeff</code> | 互相干性调整系数, 防止过消除, 越小能力越强, 低混响场景建议取值2, 中高混响场景<br>建议取值1 |

<!-- source:cn p21 unit:101 -->

5) 舒适噪声参数设置 (生效需要启用 preproc_bf_cng)

<!-- source:cn p21 unit:102 -->

| 属性 | 说明 |
| --- | --- |
| <code>fGain</code> | 建议范围:0~50dB, 施加舒适噪声幅度比例, 默认2 |
| <code>fMpy</code> | 建议范围:0~50dB, 白噪随机数生成幅度, 默认5 |
| <code>fSmoothAlpha</code> | 取值范围:0.0f~1.0f, 施加舒适噪声平滑度, 默认0.92 |
| <code>fSpeechGain</code> | 取值范围:0.0f~1.0f, 施加舒适噪声语音纹理模拟程度, 默认0.3 |

<!-- source:cn p21 unit:103 -->

6) DTD 模块参数设置 (生效需要启用 preproc_bf_dtd)

<!-- source:cn p21 unit:104 -->

| 属性 | 说明 |
| --- | --- |
| <code>ksiThd_high</code> | 单双讲判决阈值, ceil阈值, 高于该阈值判断为单讲 |
| <code>ksiThd_low</code> | floor阈值, 低于该阈值判断为单讲 |

<!-- source:cn p21 unit:105 -->

7) DOA 模块参数设置 (生效需要启用 preproc_bf_doa)

<!-- source:cn p22 unit:106 -->

| 属性 | 说明 |
| --- | --- |
| <code>rad</code> |  |
| <code>start_freq</code> |  |
| <code>end_freq</code> |  |
| <code>lg_num</code> |  |
| <code>lg_pitch_num</code> |  |

<!-- source:cn p22 unit:107 -->

8) EQ 模块参数设置 (生效需要启用 preproc_bf_eq)

<!-- source:cn p22 unit:108 -->

| 属性 | 说明 |
| --- | --- |
| <code>shwParaLen</code> | 滤波器系数个数 |
| <code>filter_bank_0</code> | 滤波器系数 |
| <code>filter_bank_1</code> | 滤波器系数 |
| <code>filter_bank_2</code> | 滤波器系数 |
| <code>filter_bank_3</code> | 滤波器系数 |
| <code>filter_bank_4</code> | 滤波器系数 |

<!-- source:cn p22 unit:109 -->

### 3.3 参数调试

<!-- source:cn p22 unit:110 -->

确保 build 版本是 userdebug确保 PC 可以通过 ADB 连接设备在 PC 端执行以下两个指令

<!-- source:cn p22 unit:111 -->

```text
adb root
adb remount
```

<!-- source:cn p22 unit:112 -->

#### 3.3.1 更新参数

<!-- source:cn p22 unit:113 -->

修改 rkaudio_effect_preprocess.xml, 并 push 到设备对应的目录

<!-- source:cn p22 unit:114 -->

```text
adb push rkaudio_effect_preprocess.xml /vendor/etc/
```

<!-- source:cn p22 unit:115 -->

#### 3.3.2 分析输出

<!-- source:cn p22 unit:116 -->

重新开始录音检查效果, 或重新开始语音检查远端输出的效果也可以直接 dump 输入和输出, 分析对应的数据流

<!-- source:cn p22 unit:117 -->

```text
setenforce 0
setprop vendor.audio.preproc.debug 1
```

<!-- source:cn p22 unit:118 -->

之后导出并用 audacity 或其他 PC 工具分析以下两个文件

<!-- source:cn p23 unit:119 -->

```text
/data/misc/audioserver/preproc_input_xxxhz_xxxch.pcm
/data/misc/audioserver/preproc_output_xxxhz_xxxch.pcm
```

<!-- source:cn p23 unit:120 -->

其中 xxxhz 表示采样率, xxxch 表示声道数使用 audacity 分析时, 依次点击 文件 , 导入 , 原始数据 , 然后修改采样率和声道数即可确认符合效果之后把 rkaudio_effect_preprocess.xml 更新到hardware/rockchip/audio/preprocess/

<!-- source:cn p23 unit:121 -->

## 4. Q&A

<!-- source:cn p23 unit:122 -->

### 4.1 加入 DLP 后, 无法以指定的声道 (MIC + 回采) 录音, 提示参数错误

<!-- source:cn p23 unit:123 -->

以 2 channel MIC 和 2 channel 回采为例

<!-- source:cn p23 unit:124 -->

```text
# tinycap /sdcard/mic.wav -D xxx -c 4 -r 48000
Unable to open PCM device (cannot set hw params: Invalid argument)
Captured 0 frames
```

<!-- source:cn p23 unit:125 -->

xxx 是 cat /proc/asound/cards 后看到的对应的声卡序号

<!-- source:cn p23 unit:126 -->

#### 4.1.1 检查通路设置

<!-- source:cn p23 unit:127 -->

(1) 确认是否能正常设置通路

<!-- source:cn p23 unit:128 -->

```text
# tinymix -D xxx "Software Digital Loopback Mode" "4CH: 2 Mics + 2 Loopbacks"
```

<!-- source:cn p23 unit:129 -->

如果报错了需要确以下 3 点

<!-- source:cn p23 unit:130 -->

```text
Invalid mixer control: Software Digital Loopback Mode
```

<!-- source:cn p23 unit:131 -->

需要确认当前版本的 kernel 是否增加了 DLP 支持, 没有则更新 SDK 或加入补丁

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

需要确认 kernel 是否开启了 DLP

<!-- source:cn p23 unit:134 -->

```text
CONFIG_SND_SOC_ROCKCHIP_DLP_PCM
```

<!-- source:cn p23 unit:135 -->

需要在 dts 对应的 cpu dai 上使能 DLP

<!-- source:cn p23 unit:136 -->

```text
&i2s {
        rockchip,digital-loopback;
};
```

<!-- source:cn p24 unit:137 -->

cpu dai 可以是: i2s0_8ch, i2s1_8ch, i2s2_2ch, i2s3_2ch, sai0, sai1 等等(2) 确认通路是否生效

<!-- source:cn p24 unit:138 -->

```text
# tinymix -D xxx
...
13      ENUM    1       Software Digital Loopback Mode           4CH: 2 Mics + 2
Loopbacks
...
```

<!-- source:cn p24 unit:139 -->

#### 4.1.2 检查声卡相关

<!-- source:cn p24 unit:140 -->

确认 dts 绑定的 codec dai driver 是否声明支持 4 channel capture

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

如果不支持则可以使用 "rockchip,multicodecs-card", 同时绑定一个辅助的虚拟 codec

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
