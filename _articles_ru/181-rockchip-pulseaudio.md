---
title: "Rockchip PulseAudio: UCM/UCM2 и обнаружение JACK"
description: "Rockchip PulseAudio: UCM/UCM2 и обнаружение JACK — V1.0.0"
excerpt: "Rockchip PulseAudio: UCM/UCM2 и обнаружение JACK"
translation_key: "181-rockchip-pulseaudio"
slug: "181-rockchip-pulseaudio"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Audio]
---

{% raw %}

Платформенная справка ArmSoM с полным техническим содержанием Rockchip. Проверяйте плату, SoC, SDK/BSP, ядро и аудиоаппаратуру/библиотеки; поддержка всех плат не заявляется. Результаты и журналы не являются тестами ArmSoM. Команды и аппаратная проверка не выполнялись.

Исходник V1.0.0 описывает PulseAudio, разработку и отладку драйверов RK/Linux4.19/Linux5.10. Есть только китайский PDF; переводы используют его рисунок. Debian10/11 и версии PulseAudio относятся к исходной среде, не являются текущими рекомендациями.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. Введение в Linux PulseAudio

PulseAudio (ранее Polypaudio) — кроссплатформенная сетевая аудиослужба, обычно используемая в Linux и FreeBSD. Подробнее: https://wiki.archlinux.org/title/PulseAudio и https://www.freedesktop.org/wiki/Software/PulseAudio/Documentation/User/Modules/

## 2. Интерфейс управления PulseAudio: pavucontrol

pavucontrol выбирает входы/выходы устройств, регулирует громкость и другие параметры.

![Технический рисунок оригинала](/docs/rockchip-pulseaudio/assets/cn-p004-figure-01.png)

## 3. Настройка PulseAudio

### 3.1 Настройка ucm2

Debian11 с pulseaudio-14.2 использует ucm2. Настройка:

```text
3588/debian/overlay/etc/pulse$ tree
.
├── daemon.conf
└── default.pa
~/3588/debian/overlay/usr/share$ tree
.
├── alsa
│   └── ucm2
│       ├── README.md
│       ├── rockchip-es8388
│       │   ├── HiFi.conf
│       │   └── rockchip-es8388.conf
│       ├── rockchip-hdmi0
│       │   ├── Hdmi.conf
│       │   └── rockchip-hdmi0.conf
│       ├── rockchip-hdmi1
│       │   ├── Hdmi.conf
│       │   └── rockchip-hdmi1.conf
│       └── ucm.conf
```

Настройка rockchip-hdmi0:

```text
~/3588/debian/overlay/usr/share/alsa/ucm2/rockchip-hdmi0$ cat rockchip-hdmi0.conf
Syntax 2

Comment "Rockchip HDMI card"

SectionUseCase."HDMI" {
        File "Hdmi.conf"
        Comment "HDMI/Display Port 1 Stereo"
}
~/3588/debian/overlay/usr/share/alsa/ucm2/rockchip-hdmi0$ cat Hdmi.conf
# Usecase for device HDMI0/Display Port stereo playback on rockchip platforms
# For Audio in I2S mode

SectionDevice."HDMI0" {
        Comment "HDMI/Display Port 1 Stereo"

        Value {
                PlaybackPriority 300
                PlaybackPCM "hw:${CardId}"
                If.1 {
                        Condition {
                                Type ControlExists
                                Control "iface=CARD,name='rockchip-hdmi0 Jack'"
                        }
                        True {
                                JackControl "rockchip-hdmi0 Jack"
                        }
                        False {
                                JackControl "rockchip-hdmi0 Jack"
                        }
                }
        }
}
```

JackControl "rockchip-hdmi0 Jack" — стандартный механизм обнаружения разъёмов Linux. Конфигурация: arch/arm64/boot/dts/rockchip/rk3588-evb.dtsi.

```text
hdmi0_sound: hdmi0-sound {
        status = "disabled";
        compatible = "rockchip,hdmi";
        rockchip,mclk-fs = <128>;
        rockchip,card-name = "rockchip-hdmi0";
        rockchip,cpu = <&i2s5_8ch>;
        rockchip,codec = <&hdmi0>;
        rockchip,jack-det;
};
```

Драйвер: sound/soc/rockchip/rockchip_hdmi.c. rockchip,jack-det включает Jack, имя — rockchip,card-name. Далее конфигурация rockchip-es838 (написание исходника):

```text
~/3588/debian/overlay/usr/share/alsa/ucm2/rockchip-es8388$ ls
HiFi.conf  rockchip-es8388.conf
~/3588/debian/overlay/usr/share/alsa/ucm2/rockchip-es8388$ cat rockchip-es8388.conf
Syntax 2

Comment "Rockchip ES8388 card"

SectionUseCase."HiFi" {
        File "HiFi.conf"
        Comment "Default"
}
~/3588/debian/overlay/usr/share/alsa/ucm2/rockchip-es8388$ cat HiFi.conf
SectionVerb {
        Value {
                MinBufferLevel "512"
        }
        EnableSequence [
                cset "name='Speaker Switch' off"
                cset "name='Headphone Switch' off"
                cset "name='Headset Mic Switch' off"
                cset "name='Main Mic Switch' off"
                cset "name='Speaker Switch' off"
                cset "name='Headphone Switch' off"
                cset "name='Headset Mic Switch' off"
                cset "name='Main Mic Switch' off"
                cset "name='PCM Volume' 192"
                cset "name='Output 1 Playback Volume' 27"
                cset "name='Output 2 Playback Volume' 27"
                cset "name='Capture Digital Volume' 192"
                cset "name='Left Channel Capture Volume' 3"
                cset "name='Right Channel Capture Volume' 3"
                cset "name='Left Mixer Left Playback Switch' on"
                cset "name='Right Mixer Right Playback Switch' on"
                cset "name='Capture Mute' off"
                cset "name='Right PGA Mux' DifferentialR"
                cset "name='Left PGA Mux' DifferentialL"
        ]
}

SectionDevice."Speaker" {
        Comment "Speaker"

        ConflictingDevice [
                "Headphones"
        ]

        Value {
                PlaybackPriority 100
                PlaybackPCM "hw:${CardId}"
        }

        EnableSequence [
                cset "name='Speaker Switch' on"
        ]

        DisableSequence [
                cset "name='Speaker Switch' off"
        ]
}

SectionDevice."Mic" {
        Comment "Internal Microphone"

        ConflictingDevice [
                "Headset"
        ]

        Value {
                CapturePriority 100
                CapturePCM "hw:${CardId}"
        }
        EnableSequence [
                cset "name='Differential Mux' Line 2"
                cset "name='Main Mic Switch' on"
        ]

        DisableSequence [
                cset "name='Main Mic Switch' off"
        ]
}

SectionDevice."Headphones" {
        Comment "Headphones"

        ConflictingDevice [
                "Speaker"
        ]

        Value {
                PlaybackPriority 200
                PlaybackPCM "hw:${CardId}"
                JackControl "Headphone Jack"
                JackHWMute "Speaker"
        }

        EnableSequence [
                cset "name='Headphone Switch' on"
        ]
        DisableSequence [
                cset "name='Headphone Switch' off"
        ]
}

SectionDevice."Headset" {
        Comment "Headset Microphone"

        ConflictingDevice [
                "Mic"
        ]

        Value {
                CapturePriority 200
                CapturePCM "hw:${CardId}"
                JackControl "Headset Mic Jack"
                JackHWMute "Mic"
        }

        EnableSequence [
                cset "name='Differential Mux' Line 1"
                cset "name='Headset Mic Switch' on"
        ]

        DisableSequence [
                cset "name='Headset Mic Switch' off"
        ]
}
```

Настроены два разъёма: "Headphone Jack" обнаруживает наушники для выбора динамика/наушников; "Headset Mic Jack" обнаруживает микрофон гарнитуры для выбора микрофона платы/гарнитуры. Конфигурация:

```text
es8388_sound: es8388-sound {
        status = "okay";
        compatible = "rockchip,multicodecs-card";
        rockchip,card-name = "rockchip-es8388";
        hp-det-gpio = <&gpio1 RK_PD5 GPIO_ACTIVE_LOW>;
        io-channels = <&saradc 3>;
        io-channel-names = "adc-detect";
        keyup-threshold-microvolt = <1800000>;
        poll-interval = <100>;
        spk-con-gpio = <&gpio1 RK_PD3 GPIO_ACTIVE_HIGH>;
        hp-con-gpio = <&gpio1 RK_PD2 GPIO_ACTIVE_HIGH>;
        rockchip,format = "i2s";
        rockchip,mclk-fs = <256>;
        rockchip,cpu = <&i2s0_8ch>;
        rockchip,codec = <&es8388>;
        rockchip,audio-routing =
                "Headphone", "LOUT1",
                "Headphone", "ROUT1",
                "Speaker", "LOUT2",
                "Speaker", "ROUT2",
                "Headphone", "Headphone Power",
                "Headphone", "Headphone Power",
                "Speaker", "Speaker Power",
                "Speaker", "Speaker Power",
                "LINPUT1", "Main Mic",
                "LINPUT2", "Main Mic",
                "RINPUT1", "Headset Mic",
                "RINPUT2", "Headset Mic";
        pinctrl-names = "default";
        pinctrl-0 = <&hp_det>;
        play-pause-key {
                label = "playpause";
                linux,code = <KEY_PLAYPAUSE>;
                press-threshold-microvolt = <2000>;
        };
};
```

| Свойство | Значение | Описание |
| --- | --- | --- |
| hp-det-gpio | phandle | Вывод обнаружения наушников; вставка/извлечение через прерывания |
| spk-con-gpio | phandle | Управление усилителем/динамиком |
| hp-con-gpio | phandle | Управление наушниками |
| io-channels | phandle | Канал ADC для различения 3-/4-контактной гарнитуры и кнопок |
| poll-interval | int | Интервал опроса ADC, по умолчанию 100ms |
| keyup-threshold-microvolt | int | Напряжение кнопки ADC |
| play-pause-key | phandle | Определяет play/pause; другие кнопки задаются по необходимости |
| rockchip,audio-routing | string | Маршрутизация звуковой карты |

Низкий gpio1_d5 обнаруживает наушники; gpio1_d2 включает их, высокий gpio1_d3 включает динамик. adc3 различает 3-/4-контактные гарнитуры и поддерживает кнопку play/pause на кабеле. Headphone соответствует es8388 LROUT1, Headphone Power управляет gpio1_d2. Speaker соответствует LROUT2, Speaker Power управляет gpio1_d3. LINPUT — Main Mic, RINPUT — Headset Mic.

### 3.2 Настройка ucm

Debian10 с pulseaudio-13.99.x использует ucm. Настройка:

```text
alsa$ tree
.
├── ucm
│   ├── rockchip,hdmi
│   │   ├── HDMI.conf
│   │   └── rockchip,hdmi.conf
│   ├── rockchip,rk618-hdmi
│   │   ├── HDMI.conf
│   │   └── rockchip,rk618-hdmi.conf
│   ├── rockchip,rk809-codec
│   │   ├── HiFi.conf
│   │   └── rockchip,rk809-codec.conf
alsa$ cat ucm/rockchip,hdmi/rockchip,hdmi.conf
SectionUseCase."HDMI" {
        File "HDMI.conf"
        Comment "Rockchip HDMI/Display Port Stereo."
}
alsa$ cat ucm/rockchip,hdmi/HDMI.conf
# Use case for devices on rockchip,hdmi card.

SectionDevice."HDMI1" {
        Comment "Rockchip HDMI/Display Port Stereo"

        EnableSequence [

        ]

        DisableSequence [

        ]

        Value {
                PlaybackPCM "hw:rockchiphdmi"
                PlaybackChannels "2"
                PlaybackPriority "5800"
                JackControl "rockchip,hdmi Jack"
        }
}
alsa$ cat ucm/rockchip,rk618-hdmi/rockchip,rk618-hdmi.conf
SectionUseCase."HDMI" {
        File "HDMI.conf"
        Comment "RK618 HDMI/Display Port Stereo."
}
alsa$ cat ucm/rockchip,rk618-hdmi/HDMI.conf
# Use case for devices on rockchip,rk618-hdmi card.

SectionDevice."HDMI2" {
        Comment "RK618 HDMI/Display Port 2 Stereo"

        EnableSequence [

        ]

        DisableSequence [

        ]

        Value {
                PlaybackPCM "hw:rockchiprk618hd"
                PlaybackChannels "2"
                PlaybackPriority "5900"
                JackControl "rockchip,rk618-hdmi Jack"
        }
}
alsa$ cat ucm/rockchip,rk809-codec/rockchip,rk809-codec.conf
SectionUseCase."HiFi" {
        File "HiFi.conf"
        Comment "Play HiFi quality Music."
}
alsa$ cat ucm/rockchip,rk809-codec/HiFi.conf
# Use case for devices on rockchip,rk809-codec card.

SectionVerb {
        EnableSequence [
                cdev "hw:rockchiprk809co"
        ]

        DisableSequence [
                cdev "hw:rockchiprk809co"
        ]
}

SectionDevice."Headphone" {
        Comment "Headphones Playback"

        EnableSequence [
                cdev "hw:rockchiprk809co"

                cset "name='Playback Path' HP"
        ]

        DisableSequence [
                cdev "hw:rockchiprk809co"

                cset "name='Playback Path' OFF"
        ]

        Value {
                PlaybackPCM "hw:rockchiprk809co"
                PlaybackChannels "2"
                PlaybackPriority "1"
                JackControl "Headphones Jack"
                JackHWMute "Speaker"
        }
}

SectionDevice."Speaker" {
        Comment "Speaker Playback"

        EnableSequence [
                cdev "hw:rockchiprk809co"

                cset "name='Playback Path' SPK"
        ]

        DisableSequence [
                cdev "hw:rockchiprk809co"

                cset "name='Playback Path' OFF"
        ]

        Value {
                PlaybackPCM "hw:rockchiprk809co"
                PlaybackChannels "2"
                PlaybackPriority "2"
        }
}

SectionDevice."Headset" {
        Comment "Headset Mic"
        ConflictingDevice [
                "MainMic"
        ]
        EnableSequence [
                cdev "hw:rockchiprk809co"
                cset "name='Capture MIC Path' Hands Free Mic"
        ]

        DisableSequence [
                cdev "hw:rockchiprk809co"
                cset "name='Capture MIC Path' MIC OFF"
        ]

        Value {
                CapturePCM "hw:rockchiprk809co"
                CaptureChannels "2"
                JackControl "Mic Jack"
                JackHWMute "MainMic"
        }
}

SectionDevice."MainMic" {
        Comment "Main Mic"
        ConflictingDevice [
                "Headset"
        ]
        EnableSequence [
                cdev "hw:rockchiprk809co"
                cset "name='Capture MIC Path' Main Mic"
        ]

        DisableSequence [
                cdev "hw:rockchiprk809co"
                cset "name='Capture MIC Path' MIC OFF"
        ]

        Value {
                CapturePCM "hw:rockchiprk809co"
                CaptureChannels "2"
        }
}
```

## 4. Проверка состояния JACK

Получите ID карты командой cat, затем проверьте состояние разъёма через amixer -c id contents. Пример:

```text
root@linaro-alip:/# cat /proc/asound/cards
 0 [rockchipes8388 ]: rockchip-es8388 - rockchip-es8388
                      rockchip-es8388
 1 [rockchiphdmiin ]: rockchip_hdmiin - rockchip,hdmiin
                      rockchip,hdmiin
 2 [rockchiphdmi0  ]: rockchip-hdmi0 - rockchip-hdmi0
                      rockchip-hdmi0
 3 [rockchiphdmi1  ]: rockchip-hdmi1 - rockchip-hdmi1
                      rockchip-hdmi1
```

Пример: HDMI0 не подключён к rockchip-hdmi0:

```text
root@linaro-alip:/# amixer -c 2 contents
numid=2,iface=CARD,name='rockchip-hdmi0 Jack'
  ; type=BOOLEAN,access=r-------,values=1
  : values=off
```

Пример: состояние rockchip-es8388 ниже означает подключение Headphone и Headset Mic.

```text
root@linaro-alip:/# amixer -c 0 contents
numid=26,iface=CARD,name='Headphone Jack'
  ; type=BOOLEAN,access=r-------,values=1
  : values=on
numid=27,iface=CARD,name='Headset Mic Jack'
  ; type=BOOLEAN,access=r-------,values=1
  : values=on
```

{% endraw %}
