---
title: "Rockchip RockAA Utils: офлайн- и онлайн-тестирование аудиоалгоритмов"
description: "Rockchip RockAA Utils: офлайн- и онлайн-тестирование аудиоалгоритмов — V1.0.0"
excerpt: "Rockchip RockAA Utils: офлайн- и онлайн-тестирование аудиоалгоритмов"
translation_key: "179-rockchip-rockaa-utils"
slug: "179-rockchip-rockaa-utils"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Audio, RockAA]
---

{% raw %}

Полный материал китайского/английского V1.0.0 о тестировании RockAA Utils. Исходная область — все серии/общая; для ArmSoM это платформенная справка: проверяйте SoC, SDK/BSP, аудиовход/выход, ALSA-устройства и версии/доступность библиотек. Время и нагрузка в журнале не являются измерениями ArmSoM. Аудиокоманды не выполнялись. Технических рисунков нет.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. Обзор

### 1.1 Возможности RockAA Utils

RockAA (Rockchip Audio Algorithm) Utils позволяет быстро предварительно проверить аудиоалгоритмы Rockchip без зависимости от мультимедийной инфраструктуры. Проект основан на идеях tinycap и tinyplay и состоит прежде всего из rockaa_capt и rockaa_play; параметры команд выбирают сценарий проверки. Оба используют общую librockaa.so. rockaa_capt предназначен преимущественно для разговорной связи, rockaa_play — для эффектов воспроизведения, поэтому зависимости алгоритмических библиотек различаются:

```text
rockaa_capt
├── librockaa.so            # rockaa⼯具公共库
├── libaec_bf_process.so    # 回声消除算法库
└── librkaudio_common.so    # ⾳频算法公共库

rockaa_play
├── librockaa.so            # rockaa⼯具公共库
└── librkaudio_effect.so    # ⾳效算法库
```

## 2. Сценарии и использование

Основные сценарии: разговорная связь (Talk) и эффекты воспроизведения (Playback Effect).

### 2.1 Офлайн-тест разговорной связи из файла

Обычно перед настройкой алгоритма звук заранее записывают на серийном устройстве с окончательной конструкцией. Этот фиксированный источник используют для настройки параметров до получения ожидаемого аудиовыхода:

```text
./rockaa_capt -I record.pcm -O out_talk.pcm -c 2 -C 1 -b 16 -r 16000 -Z 1 -F config_aivqe.json
```

Этот журнал обозначает офлайн-тест разговорной связи из файла:

```text
[tagI] Capture via offline file process, in_file: record.wav
```

Основные параметры:

-I — единственный переключатель между офлайн-файлом и онлайн-режимом. При его наличии record.pcm является заранее записанным входом.

-O out_talk.pcm задаёт имя выходного PCM после обработки: один канал, разрядность и частота соответствуют -b 16 -r 16000. Без -O имя выходного PCM начинается с TALK.

-c 2 — общее число каналов, -C 1 — число каналов опорного сигнала дальнего конца. Каналы ближнего микрофона равны разности: 2-1=1, один микрофон.

-b 16 -r 16000 задаёт 16bit и 16kHz. -Z 1 включает summary debug mode: после теста выводятся число кадров, минимальное/максимальное/среднее время и нагрузка.

-Z 0 отключает статистику, -Z 2 выводит время и нагрузку каждого кадра. -Z 3 сочетает -Z 1 и -Z 2: каждый кадр и итоговая сводка.

-F config_aivqe.json задаёт JSON параметров алгоритма. Без него офлайн-режим завершается с ошибкой. Исходные примеры журнала и команды приведены ниже.

```text
[tagI] == frames:63, period_time:16000us, cost_time min:657us max:1375us
avg:793us, load min:4.11% max:8.59% avg:4.96% ==
[tagI] frame[1] period_time: 16000 us, cost_time: 942 us, load: 5.89%
[tagI] frame[2] period_time: 16000 us, cost_time: 808 us, load: 5.05%
[tagI] frame[3] period_time: 16000 us, cost_time: 858 us, load: 5.36%
./rockaa_capt -I record.wav -O out_talk.pcm -c 2 -C 1 -b 16 -r 16000 -Z 1
input file: record.wav
[tagE] Can't support in_file: record.wav without conf file
```

### 2.2 Онлайн-тест разговорной связи в реальном времени

После удовлетворительной офлайн-настройки исключите -I, чтобы перейти к онлайн-тесту в реальном времени, более близкому к пользовательскому сценарию:

```text
./rockaa_capt record.wav -O out_talk.pcm -D 0 -d 0 -c 2 -C 1 -b 16 -r 16000 -Z 1 -F config_aivqe.json
```

Этот журнал обозначает онлайн-разговор в реальном времени:

```text
[tagI] Capture via run-time process
```

Большинство параметров совпадает с офлайн-тестом; отличия:

record.wav сохраняет исходный звук до алгоритма в WAV. -D 0 -d 0 следует TINYALSA/ALSA и выбирает запись с card0/device0. -t 10 означает 10 s записи. -F config_aivqe.json выбирает JSON параметров. Без -F включается bypass capture, эквивалентный tinycap, с приведённым ниже журналом.

```text
./rockaa_capt record.wav -D 0 -d 0 -c 2 -C 1 -b 16 -r 16000 -Z 1
[tagI] Not specify conf_path and capture raw pcm directly
```

### 2.3 Офлайн-тест эффектов воспроизведения

Для эффектов также сначала используйте -I и имеющуюся аудиозапись для офлайн-настройки:

```text
./rockaa_play -I speech_2ch.wav -O out_effect.pcm -p 256 -Z 1 -F config_playeffect.bin
```

Этот журнал обозначает офлайн-тест эффектов:

```text
[tagI] Playback via offline file process, in_file: speech_2ch.wav
```

Основные параметры:

-I по-прежнему единственный переключатель офлайн/онлайн; speech_2ch.wav — заранее записанный вход. -O out_effect.pcm задаёт выходной PCM, по исходнику одноканальный, с разрядностью и частотой -b 16 -r 16000. Без -O выходное имя начинается с EFFECTPLAY.

-c -b -r задают каналы, разрядность и частоту PCM; нижний регистр -i raw принудительно выбирает PCM. Здесь WAV разбирается автоматически и воспроизводится в своём формате.

-p 256 задаёт 256 отсчётов на кадр: при 16kHz это 256/16000=16ms. -Z 0/-Z 1/-Z 2/-Z 3 действуют как в rockaa_capt. -F config_playeffect.bin выбирает конфигурацию эффектов; без него офлайн-режим завершается с ошибкой, как показано ниже.

```text
./rockaa_play -I speech_2ch.wav -O out_effect.pcm -p 256 -Z 1
[tagE] Can't support in_file: speech_2ch.wav without conf file
```

### 2.4 Онлайн-тест эффектов воспроизведения

После удовлетворительной офлайн-настройки удалите -I для онлайн-теста эффектов в реальном времени:

```text
./rockaa_play speech_2ch.wav -D 0 -d 0 -p 256 -Z 1 -F config_playeffect.bin
```

Этот журнал обозначает онлайн-воспроизведение в реальном времени:

```text
[tagI] Playback via run-time process
```

Большинство параметров совпадает с предыдущими. Без -F включается bypass playback, эквивалентный tinyplay, с соответствующим журналом. Пример:

```text
./rockaa_play speech_2ch.wav -D 0 -d 0 -p 256 -Z 1
[tagI] Not specify conf_path and playback raw pcm directly
```

## 3. Подробная справка help

Справка rockaa_capt:

```text
# ./rockaa_capt
Usage: ./rockaa_capt [OPTION]...

-h, help
-v  print current version
-b, bits of samples
-r, the sample rate for stream (default: 16000)
-c, the number of channels (default: 2)
-C, the number of far-end channels (default: 1)
-p, the size of per-period (default: 256)
-n, the number of periods (default: 4)
-t, capture time (default: UINT_MAX)
-a, enable DOA and return result (default: disabled)
-F, the path of json config file, without it capture raw pcm directly
-I, use offline input file mode, without capture via sound card
-Z, use debug mode, 0:disabled 1:summary 2:per-frame 3:summary+per-frame
(default: 0)
For example:
    ./rockaa_capt cap.wav -c 2 -C 1 -b 16 -r 16000 -t 10 -Z 1 -F config_aivqe.json
```

Справка rockaa_play:

```text
# ./rockaa_play
usage: ./rockaa_play file.wav [options]
options:
-D | --card   <card number>    The card to receive the audio
-d | --device <device number>  The device to receive the audio
-p | --period-size <size>      The size of the PCM's period
-n | --period-count <count>    The number of PCM periods
-i | --file-type <file-type>   The type of file to read (raw or wav)
-c | --channels <count>        The amount of channels per frame
-r | --rate <rate>             The amount of frames per second
-b | --bits <bit-count>        The number of bits in one sample
-f | --float                   The frames are in floating-point PCM
-M | --mmap                    Use memory mapped IO to play audio
-F | --conf-name               The parameters of configuration File, (Mandatory)
-I | --in-file                 Use offline input file mode, without playback via
sound card
-O | --out-file                The output file name
-Z | --debug-mode              Use debug mode, 0:disabled 1:summary 2:per-frame
3:summary+per-frame (default: 0)
For example:
    ./rockaa_play -I speech_2ch.wav -O out_effect.pcm -p 256 -Z 1 -F config_playeffect.bin
```

{% endraw %}
