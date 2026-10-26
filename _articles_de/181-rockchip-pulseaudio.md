---
title: "Rockchip PulseAudio: UCM/UCM2 und JACK-Erkennung"
description: "Rockchip PulseAudio: UCM/UCM2 und JACK-Erkennung — V1.0.0"
excerpt: "Rockchip PulseAudio: UCM/UCM2 und JACK-Erkennung"
translation_key: "181-rockchip-pulseaudio"
slug: "181-rockchip-pulseaudio"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Audio]
---

{% raw %}

ArmSoM-Plattformreferenz mit vollständigem technischen Rockchip-Inhalt. Board, SoC, SDK/BSP, Kernel und Audiohardware/-bibliotheken prüfen; keine Zusage für alle Boards. Ergebnisse und Protokolle sind keine ArmSoM-Tests. Keine Befehle oder Hardwarevalidierung ausgeführt.

Quelle V1.0.0 behandelt PulseAudio, Treiberentwicklung und Diagnose für RK/Linux4.19/Linux5.10. Nur chinesisches PDF vorhanden; Übersetzungen nutzen dessen Originalbild. Debian10/11 und PulseAudio-Versionen beschreiben die Quellumgebung, keine aktuellen Empfehlungen.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. Linux PulseAudio: Einführung

PulseAudio (früher Polypaudio) ist ein plattformübergreifender, netzwerkfähiger Audiodienst, meist unter Linux und FreeBSD. Weitere Informationen: https://wiki.archlinux.org/title/PulseAudio und https://www.freedesktop.org/wiki/Software/PulseAudio/Documentation/User/Modules/

## 2. PulseAudio-Bedienoberfläche: pavucontrol

pavucontrol wählt Geräteein-/ausgänge und steuert Lautstärke sowie weitere Einstellungen.

![Technische Originalabbildung](/docs/rockchip-pulseaudio/assets/cn-p004-figure-01.png)

## 3. PulseAudio-Konfiguration

### 3.1 ucm2-Konfiguration

Debian11 mit pulseaudio-14.2 verwendet ucm2. Konfiguration:

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

rockchip-hdmi0-Konfiguration:

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

JackControl "rockchip-hdmi0 Jack" ist der standardmäßige Linux-Anschlusserkennungsmechanismus. Konfiguration: arch/arm64/boot/dts/rockchip/rk3588-evb.dtsi.

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

Treiber: sound/soc/rockchip/rockchip_hdmi.c. rockchip,jack-det aktiviert Jack; der Name ist rockchip,card-name. Es folgt rockchip-es838 (Originalschreibweise):

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

Zwei Jacks sind konfiguriert: "Headphone Jack" erkennt Kopfhörer für Lautsprecher-/Kopfhörerwiedergabe; "Headset Mic Jack" erkennt das Headsetmikrofon für Board-/Headsetaufnahme. Konfiguration:

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

| Eigenschaft | Wert | Beschreibung |
| --- | --- | --- |
| hp-det-gpio | phandle | Kopfhörererkennungspin; Ein-/Ausstecken per Interrupt |
| spk-con-gpio | phandle | Verstärker-/Lautsprechersteuerpin |
| hp-con-gpio | phandle | Kopfhörersteuerpin |
| io-channels | phandle | ADC-Kanal für 3-/4-polige Headsets und Tasten |
| poll-interval | int | ADC-Abfrageintervall, standardmäßig 100ms |
| keyup-threshold-microvolt | int | ADC-Tastenspannung |
| play-pause-key | phandle | Definiert Play/Pause; weitere Tasten nach Bedarf |
| rockchip,audio-routing | string | Soundkarten-Routing |

gpio1_d5 Low erkennt eingesteckte Kopfhörer; gpio1_d2 aktiviert sie, gpio1_d3 High aktiviert den Lautsprecher. adc3 unterscheidet 3-/4-polige Headsets und unterstützt die Kabel-Play/Pause-Taste. Headphone entspricht es8388 LROUT1, Headphone Power steuert gpio1_d2. Speaker entspricht LROUT2, Speaker Power steuert gpio1_d3. LINPUT entspricht Main Mic, RINPUT Headset Mic.

### 3.2 ucm-Konfiguration

Debian10 mit pulseaudio-13.99.x verwendet ucm. Konfiguration:

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

## 4. JACK-Status prüfen

Mit cat die Karten-ID ermitteln, dann mit amixer -c id contents den Jack-Status prüfen. Beispiel:

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

Beispiel: kein HDMI0-Anschluss an rockchip-hdmi0:

```text
root@linaro-alip:/# amixer -c 2 contents
numid=2,iface=CARD,name='rockchip-hdmi0 Jack'
  ; type=BOOLEAN,access=r-------,values=1
  : values=off
```

Beispiel: Der folgende rockchip-es8388-Status zeigt eingesteckte Headphone und Headset Mic.

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
