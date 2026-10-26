---
title: "Rockchip SED: API AED, плача, сигнализации и разбития стекла"
description: "Rockchip SED: API AED, плача, сигнализации и разбития стекла — V1.6.0"
excerpt: "Rockchip SED: API AED, плача, сигнализации и разбития стекла"
translation_key: "180-rockchip-sound-event-detection"
slug: "180-rockchip-sound-event-detection"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Audio, SED, RKNN]
---

{% raw %}

Полный китайский V1.6.0, область все серии/общая. Только платформенная справка ArmSoM: проверяйте SoC, SDK/BSP, аудиовход, библиотеки и RKNN/NPU-модели. Нет обещания поддержки всех плат. Английского PDF нет; выполнены полные переводы. Задержки исходника не являются измерениями ArmSoM; команды не выполнялись.

> Сохранены противоречия: 8bit char описывает четыре статуса как байты; SedBuzParam/RKAGCParam/RKSedEnable отличаются от последующих типов; EN_BCD отличается от EN_SED в enum. Рекомендации frm_len90 и buzzer_decision_len100 несовместимы с условием второго меньше первого; сверяйте заголовки и настраивайте совместно. Формула dB=20*log10(X) не задаёт опорную амплитуду, хотя32767 принято за0dB; проверить нормировку.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. Обзор

Руководство описывает Sound Event Detection: Baby Cry Detection, Abnormal Event Detection и Buzz Detection. Три модуля имеют общий интерфейс, но независимы; каждый можно включать или отключать.

## 2. Функции

### 2.1 Abnormal Event Detection(AED)

AED обнаруживает аномальные звуки в реальном времени: громкость и SNR, поддерживая вход 8k и 16k. Громкость выше заданного порога dB возвращает 1, иначе 0. SNR отделяет сигнал от стационарного окружающего шума и шума записи; выше порога возвращает 1, иначе 0. Децибелы измеряют отношение величин одинаковой размерности; амплитуда — абсолютная величина аудиоданных. Формула исходника:

`dB = 20 * log10(X)`

Отношения амплитуд соответствуют сложению/вычитанию dB: удвоение даёт 6dB. Полная амплитуда 16bit 32767 принята за 0dB, поэтому значения здесь ниже 0dB. SNR — отношение сигнала к шуму: при шуме 0dB и сигнале на 6dB выше SNR равен 6dB.

### 2.2 AI-детекция звуковSound Event Detection(SED)

SED в реальном времени обнаруживает плач, сигнализацию и разбитие стекла, только при 16k. RCNN с многоголовым вниманием анализирует около 1.5s звука. По исходнику лучшие результаты при SNR выше 6dB.

#### 2.2.1 Baby Cry Detection(BCD)

BCD использует глубокое обучение для обнаружения плача. При высоком SNR результат лучше; задержка от начала плача около 2s.

#### 2.2.2 Buzz Detection(BUZ)

BUZ распознаёт распространённые сигналы, включая дымовую, воздушную и охранную тревогу, методом глубокого обучения. Высокий SNR улучшает результат; задержка около 2s.

#### 2.2.3 Glass broken Detection(GBS)

GBS обнаруживает разбитие стекла глубоким обучением в реальном времени. Высокий SNR улучшает результат; задержка около 0.6s.

## 3. API

API: rkaudio_sed_init инициализирует SED; rkaudio_sed_destroy уничтожает; rkaudio_sed_process выполняет детекцию; rkaudio_sed_init_res возвращает результат инициализации.

### 3.1 rkaudio_sed_init

Описание: инициализация и возврат дескриптора для rkaudio_sed_process. После использования уничтожить через rkaudio_sed_destroy. Синтаксис: void *rkaudio_sed_init(int fs, int bit, int chan, RKAudioSedParam *param). Параметры:

| Параметр | Описание | Вход/выход |
| --- | --- | --- |
| fs | Частота: AED 8k/16k; BCD, BUZ, GBS только16k. | Вход |
| bit | Бит на отсчёт, обычно16bit. | Вход |
| chan | Число каналов; при многоканальном входе используется первый. | Вход |
| param | Параметры SED, см.RKAudioSedParam. Создать через rkaudio_sed_param_init либо собственные функции/коэффициенты. | Вход |

Возвращаемое значение:

| Поле / результат | Описание |
| --- | --- |
| NULL | Ошибка. |
| non-NULL | Успех. |

### 3.2 rkaudio_sed_destroy

Описание: уничтожить дескриптор SED. Синтаксис: void rkaudio_sed_destroy(void *st_). Параметры:

| Параметр | Описание | Вход/выход |
| --- | --- | --- |
| st_ | Дескриптор rkaudio_sed_init. | Вход |

Возвращаемого значения нет.

### 3.3 rkaudio_sed_init_res

Описание: вывести результат инициализации дескриптора. Синтаксис: char rkaudio_sed_init_res(void* st_). Параметры:

| Параметр | Описание | Вход/выход |
| --- | --- | --- |
| st_ | Дескриптор rkaudio_sed_init. | Вход |

Возвращает 8bit char. От младшей части исходник называет первый элемент байтом agc, второй aed, третий sed, четвёртый fir; 1 — успех, 0 — ошибка инициализации. Термин «байт» противоречит 8bit типу и требует проверки SDK.

### 3.4 rkaudio_sed_process

Описание: обнаружить события, сохранить результат в res. Синтаксис: int rkaudio_sed_process(void *st_, short *in, int in_size, RKAudioSedRes *res). Параметры:

| Параметр | Описание | Вход/выход |
| --- | --- | --- |
| st_ | Дескриптор rkaudio_sed_init. | Вход |
| in | Указатель входных данных. | Вход |
| in_size | Длина входа: кратна128 для8k, кратна256 для16k. | Вход |
| res | Указатель результата, выделяется снаружи; см.RKAudioSedRes. | Выход |

Возвращаемое значение:

| Поле / результат | Описание |
| --- | --- |
| &gt;=0 | Успех; длина обработанных данных. |
| &lt;0 | Ошибка. |

### 3.5 rkaudio_sed_param_init

Инициализация параметров SED, включение подмодулей и вызов их инициализаторов. Исходный код и значения по умолчанию открыты, допустима адаптация к данным. После работы вызвать rkaudio_sed_param_destroy. Для изменения параметров или включения модулей во время работы SED необходимо уничтожить и инициализировать заново. Синтаксис: RKAudioSedParam *rkaudio_sed_param_init(). Возвращает указатель параметров RKAudioSedParam.

### 3.6 rkaudio_sed_param_destroy

Уничтожить параметры SED. Синтаксис: void rkaudio_sed_param_destroy(RKAudioSedParam *param). Параметр: указатель SED.

### 3.7 rkaudio_sed_param_aed

Инициализировать AED внутри rkaudio_sed_param_init; уничтожение через rkaudio_sed_param_destroy. Синтаксис: SedAedParam *rkaudio_sed_param_aed(). Возвращает указатель AED.

### 3.8 rkaudio_sed_param

Инициализировать BCD/BUZ/GBS внутри rkaudio_sed_param_init; уничтожение через rkaudio_sed_param_destroy. Синтаксис исходника: SedBuzParam *rkaudio_sed_param(). Описание результата: указатель BUZ.

### 3.9 rkaudio_agc_param_init

Инициализировать AGC внутри rkaudio_sed_param_init; уничтожение через rkaudio_sed_param_destroy. Синтаксис: RKAGCParam* rkaudio_agc_param_init().

Возвращает указатель параметров AGC.

### 3.10 rkaudio_sed_lsd_db

Возврат уровня громкости AED в dB. Синтаксис: float rkaudio_sed_lsd_db(void *st_). Результат: dbfs.

### 3.11 rkaudio_sed_bcd_model_set

Задать путь RKNN для плача. Синтаксис: int rkaudio_sed_bcd_model_set(char *model_path). 0 — успех, -1 — ошибка.

## 4. Параметры

### 4.1 JUMP_FRAME

Интервал детекции SED в кадрах. Большие значения снижают частоту проверок и вычисления. Для 20 кадров интервал равен

0.016*20 = 0.32s, около трёх проверок в секунду. Рекомендуется 15-25. Пропущенные кадры сохраняют предыдущий результат. Определение:

```text
#define JUMP_FRAME 20
```

### 4.2 RKAudioSedParam

Параметры SED. Определение:

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

Поля:

| Поле / результат | Описание |
| --- | --- |
| model_en | Включение битами; см.RKSedEnable. Для AED+BCD: EN_AED &#124; EN_BCD (имена исходника). |
| SedAedParam | Параметры модуля; см.SedAedParam. |
| SedParam | Параметры модуля; см.SedParam. |
| RKSEDAGCParam | Параметры модуля; см.RKSEDAGCParam. |
| RKFIRParam | Параметры модуля; см.RKFIRParam. |

### 4.3 SedAedParam

Параметры AED. Определение:

```text
typedef struct SedAedParam_
{
    float    snr_db;
    float    lsd_db;
    int      policy;
    float    smooth_param;
} SedAedParam;
```

Поля:

| Поле / результат | Описание |
| --- | --- |
| snr_db | Порог SNR речи; выше него1. |
| lsd_db | Порог громкости; выше него1. Максимум0dB. |
| policy | Чувствительность SNR [0,2], по умолчанию1. Выше — чувствительнее, легче достичь порога. |
| smooth_param | Коэффициент сглаживания громкости (0,1); выше — больше окно. |

### 4.4 SedParam

Параметры BCD/BUZ/GBS. Определение:

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

Поля:

| Поле / результат | Описание |
| --- | --- |
| frm_len | Всего кадров [60,120], рекомендуется90. Больше — выше задержка; меньше — больше пропусков/ложных срабатываний. |
| nclass | Число классов SED; для одного плача1. |
| babycry_decision_len | Кадры подтверждения плача, меньше frm_len, [40,80], рекомендуется60. Больше — задержка/пропуски; меньше — ложные срабатывания. |
| buzzer_decision_len | Кадры подтверждения сигнализации, меньше frm_len, рекомендуется100. Больше — задержка/пропуски; меньше — ложные срабатывания. |
| glassbreaking_decision_len | Кадры стекла, меньше frm_len и больше JUMP_FRAME, рекомендуется25-50. Больше — задержка/пропуски; меньше — ложные срабатывания. |
| babycry_confirm_prob | Вероятность подтверждения [0.75,0.95], рекомендуется0.85. Выше — меньше ложных срабатываний, больше пропусков. |
| buzzer_confirm_prob | Вероятность подтверждения (0,1), рекомендуется0.5. Выше — меньше ложных срабатываний, больше пропусков. |
| glassbreaking_confirm_prob | Вероятность подтверждения (0,1), рекомендуется0.8. Выше — меньше ложных срабатываний, больше пропусков. |

### 4.5 RKAudioSedRes

Результаты SED. Определение:

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

Поля:

| Поле / результат | Описание |
| --- | --- |
| snr_res | Результат SNR threshold: 1 обнаружено/порог достигнут, 0 нет. |
| lsd_res | Результат loud-sound threshold: 1 обнаружено/порог достигнут, 0 нет. |
| bcd_res | Результат baby crying: 1 обнаружено/порог достигнут, 0 нет. |
| buz_res | Результат alarm: 1 обнаружено/порог достигнут, 0 нет. |
| gbs_res | Результат glass breaking: 1 обнаружено/порог достигнут, 0 нет. |

### 4.6 RKAudioSedEnable

Присвойте model_en для включения модуля. Объединяйте флаги, например EN_AED &#124; EN_BCD, как в исходнике. Определение:

```text
typedef enum RKAudioSedEnable_
{
    EN_AGC = 1 << 0,
    EN_AED = 1 << 1,
    EN_SED = 1 << 2,
    EN_FIR = 1 << 3,
} RKAudioSedEnable;
```

Поля:

| Поле / результат | Описание |
| --- | --- |
| EN_AGC | Включить AGC. Рекомендуется при низкой громкости. |
| EN_AED | Включить AED. |
| EN_SED | Включить SED. |
| EN_FIR | Включить FIR. |

### 4.7 RKSEDAGCParam

Параметры AGC; менять не рекомендуется. Определение:

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

Поля:

| Поле / результат | Описание |
| --- | --- |
| attack_time | Время уменьшения усиления AGC. |
| release_time | Время повышения усиления AGC. |
| max_gain | Максимальное усиление и усиление линейной области, dB. |
| max_peak | Максимальная энергия речи после AGC, dB; диапазон в исходнике не указан. |
| fRth0 | Порог конца расширения/начала линейной области, dB. |
| fRk0 | Наклон расширения (не используется). |
| fRth1 | Порог начала компрессии/конца линейной области, dB. |
| fs | Частота выборки (не используется). |
| frmlen | Длина кадра обработки (не используется). |
| attenuate_time | Время снижения усиления шума до1 (не используется). |
| fRth2 | Порог начала компрессии, dB. |
| fRk1 | Наклон расширения (не используется). |
| fRk2 | Наклон расширения (не используется). |
| fLineGainDb | Усиление линейной области в dB (не используется). |
| swSmL0 | Точки временного сглаживания расширения (не используется). |
| swSmL1 | Точки временного сглаживания линейной области (не используется). |
| swSmL2 | Точки временного сглаживания компрессии (не используется). |

### 4.8 RKFIRParam

Параметры FIR; менять не рекомендуется. Определение:

```text
typedef struct RKFIRParam_
{
    int fir_len;
    float* fir_coeffs;
} RKFIRParam;
```

Поля:

| Поле / результат | Описание |
| --- | --- |
| fir_len | Длина FIR. |
| fir_coeffs | Коэффициенты FIR. |

{% endraw %}
