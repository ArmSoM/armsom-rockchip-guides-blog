---
title: "Rockchip SED: AED, baby cry, alarms and glass-break APIs"
description: "Rockchip SED: AED, baby cry, alarms and glass-break APIs — V1.6.0"
excerpt: "Rockchip SED: AED, baby cry, alarms and glass-break APIs"
translation_key: "180-rockchip-sound-event-detection"
slug: "180-rockchip-sound-event-detection"
lang: "en"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Audio, SED, RKNN]
---

{% raw %}

Complete Chinese V1.6.0 content; source scope all series/general. ArmSoM platform reference only: verify SoC, SDK/BSP, audio input, libraries and RKNN/NPU model versions. No universal board support. Only a Chinese PDF exists; other languages are full translations. Source performance/latency is not ArmSoM measurement; no audio/NPU commands executed.

> Source inconsistencies retained: an 8bit char result describes four statuses as bytes; SedBuzParam/RKAGCParam/RKSedEnable differ from later type names; EN_BCD examples differ from enum EN_SED. Recommended frm_len90 conflicts with buzzer_decision_len100 required to be below frm_len; verify headers and configure jointly. Formula dB=20*log10(X) omits reference amplitude while text defines32767 as0dB; verify normalization.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. Overview

This guide describes Sound Event Detection: Baby Cry Detection, Abnormal Event Detection and Buzz Detection. The three modules share an interface but operate independently; each can be enabled or disabled.

## 2. Functions

### 2.1 Abnormal Event Detection(AED)

AED detects abnormal sounds in real time: loud-sound level and signal-to-noise ratio, supporting 8k and 16k input. Loud-sound detection returns 1 above the configured dB threshold, otherwise 0. SNR detection distinguishes signal from steady environmental noise and recording noise floor, returning 1 above its threshold, otherwise 0. Decibels measure the ratio of quantities with identical units; amplitude is the absolute audio-data magnitude. The source relation is:

`dB = 20 * log10(X)`

Amplitude ratios correspond to dB addition/subtraction: doubling amplitude adds 6dB. Full-scale 16bit amplitude 32767 is defined as 0dB, so the dB values here are below 0dB. SNR is the signal/noise ratio: with noise at 0dB and signal 6dB higher, SNR is 6dB.

### 2.2 AI sound-event detectionSound Event Detection(SED)

SED detects baby crying, buzzer alarms and breaking glass in real time, using only 16k input. An RCNN model with multi-head attention analyzes about 1.5s of audio. The source reports better results above 6dB SNR.

#### 2.2.1 Baby Cry Detection(BCD)

BCD uses deep learning to detect baby crying in real time. Results improve with high SNR; detection latency from cry onset is about 2s.

#### 2.2.2 Buzz Detection(BUZ)

BUZ detects common alarms, including smoke, air-raid and burglar alarms, using deep learning. Higher SNR improves results; latency from alarm onset is about 2s.

#### 2.2.3 Glass broken Detection(GBS)

GBS uses deep learning for real-time glass-break detection. Higher SNR improves results; latency from breaking-glass onset is about 0.6s.

## 3. APIs

APIs: rkaudio_sed_init initializes SED; rkaudio_sed_destroy destroys it; rkaudio_sed_process runs detection; rkaudio_sed_init_res returns initialization results.

### 3.1 rkaudio_sed_init

Description: initialize and return the SED handle used by rkaudio_sed_process. Destroy it with rkaudio_sed_destroy after use. Syntax: void *rkaudio_sed_init(int fs, int bit, int chan, RKAudioSedParam *param). Parameters:

| Parameter | Description | Input/output |
| --- | --- | --- |
| fs | Sample rate: AED supports 8k/16k; BCD, BUZ and GBS only 16k. | Input |
| bit | Bits per sample, normally16bit. | Input |
| chan | Channel count; only the first channel is used for multichannel input. | Input |
| param | SED parameters; see RKAudioSedParam. Construct with rkaudio_sed_param_init or custom functions/initial coefficients. | Input |

Return value:

| Member / return value | Description |
| --- | --- |
| NULL | Failure. |
| non-NULL | Success. |

### 3.2 rkaudio_sed_destroy

Description: destroy the SED handle. Syntax: void rkaudio_sed_destroy(void *st_). Parameters:

| Parameter | Description | Input/output |
| --- | --- | --- |
| st_ | Handle returned by rkaudio_sed_init. | Input |

Return value: none.

### 3.3 rkaudio_sed_init_res

Description: report SED-handle initialization results. Syntax: char rkaudio_sed_init_res(void* st_). Parameters:

| Parameter | Description | Input/output |
| --- | --- | --- |
| st_ | Handle returned by rkaudio_sed_init. | Input |

Returns an 8bit char. From the low end, the original calls the first field a byte for agc, the second for aed, third for sed and fourth for fir; 1 means successful initialization and 0 failure. The byte terminology conflicts with an 8bit return type and requires SDK verification.

### 3.4 rkaudio_sed_process

Description: detect sound events and store results in res. Syntax: int rkaudio_sed_process(void *st_, short *in, int in_size, RKAudioSedRes *res). Parameters:

| Parameter | Description | Input/output |
| --- | --- | --- |
| st_ | Handle returned by rkaudio_sed_init. | Input |
| in | Input-data pointer. | Input |
| in_size | Input length: multiple of128 for8k, multiple of256 for16k. | Input |
| res | Result-structure pointer, allocated externally; see RKAudioSedRes. | Output |

Return value:

| Member / return value | Description |
| --- | --- |
| &gt;=0 | Success; processed-data length. |
| &lt;0 | Failure. |

### 3.5 rkaudio_sed_param_init

Initialize SED parameters, enable submodules and call their parameter initialization functions. Source code and default values are provided and may be adjusted for actual data. Destroy with rkaudio_sed_param_destroy after use. To change parameters or module enablement during operation, destroy and reinitialize SED. Syntax: RKAudioSedParam *rkaudio_sed_param_init(). Returns the parameter pointer; see RKAudioSedParam.

### 3.6 rkaudio_sed_param_destroy

Destroy SED parameters. Syntax: void rkaudio_sed_param_destroy(RKAudioSedParam *param). Parameter: SED parameter pointer.

### 3.7 rkaudio_sed_param_aed

Initialize AED parameters, called by rkaudio_sed_param_init and destroyed by rkaudio_sed_param_destroy. Syntax: SedAedParam *rkaudio_sed_param_aed(). Returns the AED parameter pointer.

### 3.8 rkaudio_sed_param

Initialize BCD/BUZ/GBS parameters, called by rkaudio_sed_param_init and destroyed by rkaudio_sed_param_destroy. Source syntax: SedBuzParam *rkaudio_sed_param(). Source return description: BUZ parameter pointer.

### 3.9 rkaudio_agc_param_init

Initialize AGC parameters within rkaudio_sed_param_init; destroyed by rkaudio_sed_param_destroy. Syntax: RKAGCParam* rkaudio_agc_param_init().

Returns the AGC parameter pointer.

### 3.10 rkaudio_sed_lsd_db

Return AED loud-sound level in dB. Syntax: float rkaudio_sed_lsd_db(void *st_). Return: dbfs value.

### 3.11 rkaudio_sed_bcd_model_set

Set the baby-cry RKNN model path. Syntax: int rkaudio_sed_bcd_model_set(char *model_path). Returns 0 on success, -1 on failure.

## 4. Parameters

### 4.1 JUMP_FRAME

SED detection interval in frames. Larger values reduce detections per second and computation. For 20 frames, the interval is

0.016*20 = 0.32s, roughly three detections per second. Recommended range: 15-25. Skipped frames retain the preceding result. Definition:

```text
#define JUMP_FRAME 20
```

### 4.2 RKAudioSedParam

SED algorithm parameters. Definition:

```text
typedef struct RKAudioSedParam_
{
    int model_en;
    RKSEDAGCParam *agc_param;
    SedAedParam   *aed_param;
    SedParam      *sed_param;
    RKFIRParam    *fir_param;
} RKAudioSedParam;
```

Members:

| Member / return value | Description |
| --- | --- |
| model_en | Enable submodules by bit flags; see RKSedEnable. For AED+BCD use EN_AED &#124; EN_BCD (source names). |
| SedAedParam | Module parameters; see SedAedParam. |
| SedParam | Module parameters; see SedParam. |
| RKSEDAGCParam | Module parameters; see RKSEDAGCParam. |
| RKFIRParam | Module parameters; see RKFIRParam. |

### 4.3 SedAedParam

AED algorithm parameters. Definition:

```text
typedef struct SedAedParam_
{
    float    snr_db;
    float    lsd_db;
    int      policy;
    float    smooth_param;
} SedAedParam;
```

Members:

| Member / return value | Description |
| --- | --- |
| snr_db | Speech SNR threshold; returns1 above it. |
| lsd_db | Loud-sound threshold; returns1 above it. Maximum0dB. |
| policy | SNR sensitivity [0,2], default1. Higher values are more sensitive and reach the threshold more easily. |
| smooth_param | Loud-level smoothing coefficient (0,1); higher means a larger window. |

### 4.4 SedParam

BCD/BUZ/GBS parameters. Definition:

```text
typedef struct SedParam_
{
    int      frm_len;
    int      nclass;
    int      babycry_decision_len;
    int      buzzer_decision_len;
    int      glassbreaking_decision_len;
    float    babycry_confirm_prob;
    float    buzzer_confirm_prob;
    float    glassbreaking_confirm_prob;
} SedParam;
```

Members:

| Member / return value | Description |
| --- | --- |
| frm_len | Total statistical frames [60,120], recommended90. Longer increases latency; shorter increases misses/false detections. |
| nclass | Number of classes enabled in SED; set1 for baby-cry detection alone. |
| babycry_decision_len | Cry confirmation frames, below frm_len, [40,80], recommended60. Longer increases latency/misses; shorter increases false positives. |
| buzzer_decision_len | Buzzer confirmation frames, below frm_len, recommended100. Longer increases latency/misses; shorter increases false positives. |
| glassbreaking_decision_len | Glass-break confirmation frames, below frm_len and above JUMP_FRAME, recommended25-50. Longer increases latency/misses; shorter increases false positives. |
| babycry_confirm_prob | Confirmation probability [0.75,0.95], recommended0.85. Higher reduces false positives but increases misses. |
| buzzer_confirm_prob | Confirmation probability (0,1), recommended0.5. Higher reduces false positives but increases misses. |
| glassbreaking_confirm_prob | Confirmation probability (0,1), recommended0.8. Higher reduces false positives but increases misses. |

### 4.5 RKAudioSedRes

SED result structure. Definition:

```text
typedef struct RKAudioSedRes_
{
    int snr_res;
    int lsd_res;
    int bcd_res;
    int buz_res;
    int gbs_res;
} RKAudioSedRes;
```

Members:

| Member / return value | Description |
| --- | --- |
| snr_res | SNR threshold: 1 detected/threshold met, 0 not. |
| lsd_res | loud-sound threshold: 1 detected/threshold met, 0 not. |
| bcd_res | baby crying: 1 detected/threshold met, 0 not. |
| buz_res | alarm: 1 detected/threshold met, 0 not. |
| gbs_res | glass breaking: 1 detected/threshold met, 0 not. |

### 4.6 RKAudioSedEnable

Assign to model_en to enable the corresponding module. Combine flags for multiple modules, e.g. EN_AED &#124; EN_BCD as written in the source. Definition:

```text
typedef enum RKAudioSedEnable_
{
    EN_AGC = 1 << 0,
    EN_AED = 1 << 1,
    EN_SED = 1 << 2,
    EN_FIR = 1 << 3,
} RKAudioSedEnable;
```

Members:

| Member / return value | Description |
| --- | --- |
| EN_AGC | Enable AGC module. Recommended for low input volume. |
| EN_AED | Enable AED module. |
| EN_SED | Enable SED module. |
| EN_FIR | Enable FIR module. |

### 4.7 RKSEDAGCParam

AGC parameters; changes are not recommended. Definition:

```text
typedef struct RKSEDAGCParam_
{
    float    attack_time;
    float    release_time;
    float    max_gain;
    float    max_peak;
    float    fRth0;
    float    fRk0;
    float    fRth1;
    int      fs;
    int      frmlen;
    float    attenuate_time;
    float    fRth2;
    float    fRk1;
    float    fRk2;
    float    fLineGainDb;
    int      swSmL0;
    int      swSmL1;
    int      swSmL2;
} RKSEDAGCParam;
```

Members:

| Member / return value | Description |
| --- | --- |
| attack_time | Time needed for AGC gain reduction. |
| release_time | Time needed for AGC gain increase. |
| max_gain | Maximum and linear-region gain, dB. |
| max_peak | Maximum output speech energy after AGC; unit dB. Source leaves range unspecified. |
| fRth0 | Expansion-end/linear-start energy threshold, dB. |
| fRk0 | Expansion slope (unused). |
| fRth1 | Compression-start/linear-end energy threshold, dB. |
| fs | Sample rate (unused). |
| frmlen | Processing-frame length (unused). |
| attenuate_time | Noise attenuation time until gain reaches1 (unused). |
| fRth2 | Compression-start energy threshold, dB. |
| fRk1 | Expansion slope (unused). |
| fRk2 | Expansion slope (unused). |
| fLineGainDb | Linear-region gain increase in dB (unused). |
| swSmL0 | expansion time-domain smoothing points (unused). |
| swSmL1 | linear time-domain smoothing points (unused). |
| swSmL2 | compression time-domain smoothing points (unused). |

### 4.8 RKFIRParam

FIR parameters; changes are not recommended. Definition:

```text
typedef struct RKFIRParam_
{
    int fir_len;
    float* fir_coeffs;
} RKFIRParam;
```

Members:

| Member / return value | Description |
| --- | --- |
| fir_len | FIR length. |
| fir_coeffs | FIR coefficients. |

{% endraw %}
