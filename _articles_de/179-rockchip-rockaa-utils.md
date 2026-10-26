---
title: "Rockchip RockAA Utils: Offline- und Echtzeittests von Audioalgorithmen"
description: "Rockchip RockAA Utils: Offline- und Echtzeittests von Audioalgorithmen — V1.0.0"
excerpt: "Rockchip RockAA Utils: Offline- und Echtzeittests von Audioalgorithmen"
translation_key: "179-rockchip-rockaa-utils"
slug: "179-rockchip-rockaa-utils"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Audio, RockAA]
---

{% raw %}

Vollständiger Inhalt der chinesischen/englischen V1.0.0 zu RockAA-Utils-Tests. Originalgeltung: alle Serien/allgemein; für ArmSoM eine Plattformreferenz, die Prüfung von SoC, SDK/BSP, Audio-I/O, ALSA-Geräten und Algorithmusbibliotheken erfordert. Zeit-/Lastprotokolle sind keine ArmSoM-Messungen. Keine Audiobefehle ausgeführt. Keine technischen Abbildungen vorhanden.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. Überblick

### 1.1 Funktionen von RockAA Utils

RockAA (Rockchip Audio Algorithm) Utils ermöglicht eine schnelle erste Prüfung von Rockchip-Audioalgorithmen ohne Medienframework. Nach dem Vorbild von tinycap und tinyplay besteht es hauptsächlich aus rockaa_capt und rockaa_play; Befehlsparameter wählen das Testszenario. Beide nutzen librockaa.so. rockaa_capt dient vor allem Gesprächstests, rockaa_play Wiedergabeeffekten; ihre Algorithmusbibliotheken unterscheiden sich daher:

```text
rockaa_capt
├── librockaa.so            # rockaa⼯具公共库
├── libaec_bf_process.so    # 回声消除算法库
└── librkaudio_common.so    # ⾳频算法公共库

rockaa_play
├── librockaa.so            # rockaa⼯具公共库
└── librkaudio_effect.so    # ⾳效算法库
```

## 2. Szenarien und Verwendung

Hauptszenarien: Gespräch/Gegensprechen (Talk) und Wiedergabeeffekte (Playback Effect).

### 2.1 Offline-Gesprächstest aus einer Datei

Vor dem Abstimmen wird meist auf einem Seriengerät mit festgelegtem Aufbau Audio aufgezeichnet. Diese feste Eingangsquelle dient zur Parameteroptimierung, bis die gewünschten Audiodaten ausgegeben werden:

```text
./rockaa_capt -I record.pcm -O out_talk.pcm -c 2 -C 1 -b 16 -r 16000 -Z 1 -F config_aivqe.json
```

Dieses Protokoll kennzeichnet den Offline-Gesprächstest aus einer Datei:

```text
[tagI] Capture via offline file process, in_file: record.wav
```

Wesentliche Parameter:

-I ist der einzige Schalter zwischen Offlinedatei und Onlinemodus. Mit -I dient record.pcm als zuvor aufgezeichnete Eingangsquelle.

-O out_talk.pcm bestimmt den verarbeiteten PCM-Ausgabename: ein Kanal, Bitbreite und Rate gemäß -b 16 -r 16000. Ohne -O beginnt der Ausgabename mit TALK.

-c 2 ist die Gesamtkanalzahl, -C 1 die Zahl der Fernreferenzkanäle. Nahmikrofonkanäle sind die Differenz: 2-1=1, also ein Mikrofon.

-b 16 -r 16000 legt 16bit und 16kHz fest. -Z 1 aktiviert summary debug mode: Nach Testende werden Bildzahl sowie minimale/maximale/mittlere Zeit und Last ausgegeben.

-Z 0 deaktiviert Statistiken, -Z 2 zeigt Zeit und Last jedes Frames. -Z 3 kombiniert -Z 1 und -Z 2: jeden Frame und eine abschließende Zusammenfassung.

-F config_aivqe.json bestimmt die JSON-Algorithmusparameter. Ohne diese Option endet der Offlinemodus mit einem Fehler. Originalprotokolle und Befehle folgen unten.

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

### 2.2 Online-Gesprächstest in Echtzeit

Nach erfolgreicher Offline-Abstimmung -I weglassen, um zum Echtzeit-Onlinetest näher an der tatsächlichen Nutzung überzugehen:

```text
./rockaa_capt record.wav -O out_talk.pcm -D 0 -d 0 -c 2 -C 1 -b 16 -r 16000 -Z 1 -F config_aivqe.json
```

Dieses Protokoll kennzeichnet den Echtzeit-Onlinetest:

```text
[tagI] Capture via run-time process
```

Die meisten Parameter entsprechen dem Offlinetest; Unterschiede:

record.wav speichert das Audio vor der Verarbeitung als WAV. -D 0 -d 0 folgt TINYALSA/ALSA und wählt Aufnahme von card0/device0. -t 10 bedeutet 10 s Aufnahme. -F config_aivqe.json wählt die JSON-Parameter. Ohne -F wird bypass capture wie bei tinycap verwendet, mit dem unten gezeigten Protokoll.

```text
./rockaa_capt record.wav -D 0 -d 0 -c 2 -C 1 -b 16 -r 16000 -Z 1
[tagI] Not specify conf_path and capture raw pcm directly
```

### 2.3 Offline-Test von Wiedergabeeffekten

Auch Wiedergabeeffekte können zunächst mit -I und einer vorhandenen Aufnahme offline abgestimmt werden:

```text
./rockaa_play -I speech_2ch.wav -O out_effect.pcm -p 256 -Z 1 -F config_playeffect.bin
```

Dieses Protokoll kennzeichnet den Offline-Effekttest:

```text
[tagI] Playback via offline file process, in_file: speech_2ch.wav
```

Wesentliche Parameter:

-I bleibt der einzige Offline-/Online-Schalter; speech_2ch.wav ist die zuvor aufgezeichnete Eingangsquelle. -O out_effect.pcm bestimmt die PCM-Ausgabe, laut Original einkanalig mit Bitbreite und Rate -b 16 -r 16000. Ohne -O beginnt der Name mit EFFECTPLAY.

-c -b -r bestimmen Kanäle, Bitbreite und Abtastrate; das kleingeschriebene -i raw erzwingt PCM. Hier wird WAV automatisch analysiert und in seinem Format wiedergegeben.

-p 256 bedeutet 256 Abtastwerte je Frame: bei 16kHz sind das 256/16000=16ms. -Z 0/-Z 1/-Z 2/-Z 3 wirken wie bei rockaa_capt. -F config_playeffect.bin wählt die Effektkonfiguration; ohne sie endet der Offlinemodus mit dem unten gezeigten Fehler.

```text
./rockaa_play -I speech_2ch.wav -O out_effect.pcm -p 256 -Z 1
[tagE] Can't support in_file: speech_2ch.wav without conf file
```

### 2.4 Online-Test von Wiedergabeeffekten

Nach erfolgreicher Offline-Abstimmung -I für den Echtzeit-Online-Effekttest entfernen:

```text
./rockaa_play speech_2ch.wav -D 0 -d 0 -p 256 -Z 1 -F config_playeffect.bin
```

Dieses Protokoll kennzeichnet die Echtzeit-Online-Wiedergabe:

```text
[tagI] Playback via run-time process
```

Die meisten Parameter bleiben gleich. Ohne -F wird bypass playback wie bei tinyplay verwendet und entsprechend protokolliert. Beispiel:

```text
./rockaa_play speech_2ch.wav -D 0 -d 0 -p 256 -Z 1
[tagI] Not specify conf_path and playback raw pcm directly
```

## 3. Ausführliche help-Informationen

Hilfe zu rockaa_capt:

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

Hilfe zu rockaa_play:

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
